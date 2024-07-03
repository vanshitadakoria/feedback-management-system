using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace FeedbackWebAPI.Models;

public partial class FeedbackDbContext : DbContext
{
    public FeedbackDbContext()
    {
    }
    public FeedbackDbContext(DbContextOptions<FeedbackDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CustomerAdmin> CustomerAdmins { get; set; }

    public virtual DbSet<CustomerUser> CustomerUsers { get; set; }

    public virtual DbSet<FeedbackDetail> FeedbackDetails { get; set; }

    public virtual DbSet<FeedbackMaster> FeedbackMasters { get; set; }

    public virtual DbSet<OrganizationNature> OrganizationNatures { get; set; }

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<QuestionBank> QuestionBanks { get; set; }

    public virtual DbSet<QuestionCategory> QuestionCategories { get; set; }

    public virtual DbSet<Questionnaire> Questionnaires { get; set; }

    public virtual DbSet<QuestionnaireAssignment> QuestionnaireAssignments { get; set; }

    public virtual DbSet<QuestionnaireBank> QuestionnaireBanks { get; set; }

    public virtual DbSet<QuestionnaireQuestion> QuestionnaireQuestions { get; set; }

    public virtual DbSet<QuestionnaireQuestionBank> QuestionnaireQuestionBanks { get; set; }

    public virtual DbSet<RegisteredEndUser> RegisteredEndUsers { get; set; }

    public virtual DbSet<SubscriptionCategory> SubscriptionCategories { get; set; }

    public virtual DbSet<SuperAdmin> SuperAdmins { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        //optionsBuilder.UseLazyLoadingProxies();
        optionsBuilder.UseSqlServer("Data Source=localhost;Initial Catalog=feedbackDB;Integrated Security=True;Trust Server Certificate=True");
    }
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        //=> optionsBuilder.UseSqlServer("Data Source=localhost;Initial Catalog=feedbackDB;Integrated Security=True;Trust Server Certificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CustomerAdmin>(entity =>
        {
            entity.Property(e => e.ContactNo).HasMaxLength(20);
            entity.Property(e => e.CustomerTokenId).HasMaxLength(50);
            entity.Property(e => e.OfficialEmailId).HasMaxLength(50);
            entity.Property(e => e.OrganizationName).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(256);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("active");

            entity.HasOne(d => d.OrganizationNature).WithMany(p => p.CustomerAdmins)
                .HasForeignKey(d => d.OrganizationNatureId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CustomerAdmins_OrganizationNature");

            entity.HasOne(d => d.SubscriptionCategory).WithMany(p => p.CustomerAdmins)
                .HasForeignKey(d => d.SubscriptionCategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CustomerAdmins_SubscriptionCategories");
        });

        modelBuilder.Entity<CustomerUser>(entity =>
        {
            entity.Property(e => e.CustomerUserName).HasMaxLength(100);
            entity.Property(e => e.CustomerUserTokenId).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(50);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("active");

            entity.HasOne(d => d.CustomerAdmin).WithMany(p => p.CustomerUsers)
                .HasForeignKey(d => d.CustomerAdminId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CustomerUsers_CustomerAdmins");
        });

        modelBuilder.Entity<FeedbackDetail>(entity =>
        {
            entity.HasKey(e => e.FeedbackDetailsId);

            entity.HasOne(d => d.FeedBackMaster).WithMany(p => p.FeedbackDetails)
                .HasForeignKey(d => d.FeedBackMasterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FeedbackDetails_FeedbackMaster");

            entity.HasOne(d => d.Question).WithMany(p => p.FeedbackDetails)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FeedbackDetails_Question");
        });

        modelBuilder.Entity<FeedbackMaster>(entity =>
        {
            entity.ToTable("FeedbackMaster");

            entity.Property(e => e.FeedbackDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PersonContactNo).HasMaxLength(20);
            entity.Property(e => e.PersonName).HasMaxLength(100);

            entity.HasOne(d => d.CustomerUser).WithMany(p => p.FeedbackMasters)
                .HasForeignKey(d => d.CustomerUserId)
                .HasConstraintName("FK_FeedbackMaster_CustomerUsers");

            entity.HasOne(d => d.EndUser).WithMany(p => p.FeedbackMasters)
                .HasForeignKey(d => d.EndUserId)
                .HasConstraintName("FK_FeedbackMaster_RegisteredEndUsers");

            entity.HasOne(d => d.Questionnaire).WithMany(p => p.FeedbackMasters)
                .HasForeignKey(d => d.QuestionnaireId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FeedbackMaster_Questionnaire");
        });

        modelBuilder.Entity<OrganizationNature>(entity =>
        {
            entity.ToTable("OrganizationNature");

            entity.Property(e => e.NatureName).HasMaxLength(50);
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.ToTable("Question");

            entity.Property(e => e.QuestionText).HasMaxLength(100);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("active");

            entity.HasOne(d => d.CustomerAdmin).WithMany(p => p.Questions)
                .HasForeignKey(d => d.CustomerAdminId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Question_CustomerAdmins");

            entity.HasOne(d => d.QuestionCategory).WithMany(p => p.Questions)
                .HasForeignKey(d => d.QuestionCategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Question_QuestionCategory");
        });

        modelBuilder.Entity<QuestionBank>(entity =>
        {
            entity.ToTable("QuestionBank");

            entity.Property(e => e.QuestionBankText).HasMaxLength(100);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("active");

            entity.HasOne(d => d.QuestionCategory).WithMany(p => p.QuestionBanks)
                .HasForeignKey(d => d.QuestionCategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuestionBank_QuestionCategory");

            entity.HasOne(d => d.SuperAdmin).WithMany(p => p.QuestionBanks)
                .HasForeignKey(d => d.SuperAdminId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuestionBank_SuperAdmins");
        });

        modelBuilder.Entity<QuestionCategory>(entity =>
        {
            entity.ToTable("QuestionCategory");

            entity.Property(e => e.CategoryName).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("active");
        });

        modelBuilder.Entity<Questionnaire>(entity =>
        {
            entity.ToTable("Questionnaire");

            entity.Property(e => e.QuestionnaireTitle).HasMaxLength(50);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("active");

            entity.HasOne(d => d.CustomerAdmin).WithMany(p => p.Questionnaires)
                .HasForeignKey(d => d.CustomerAdminId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Questionnaire_CustomerAdmins");
        });

        modelBuilder.Entity<QuestionnaireAssignment>(entity =>
        {
            entity.HasKey(e => e.AssignmentId);

            entity.ToTable("QuestionnaireAssignment");

            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("active");

            entity.HasOne(d => d.CustomerAdmin).WithMany(p => p.QuestionnaireAssignments)
                .HasForeignKey(d => d.CustomerAdminId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuestionnaireAssignment_CustomerAdmins");

            entity.HasOne(d => d.CustomerUser).WithMany(p => p.QuestionnaireAssignments)
                .HasForeignKey(d => d.CustomerUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuestionnaireAssignment_CustomerUsers");

            entity.HasOne(d => d.Questionnaire).WithMany(p => p.QuestionnaireAssignments)
                .HasForeignKey(d => d.QuestionnaireId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuestionnaireAssignment_Questionnaire");
        });

        modelBuilder.Entity<QuestionnaireBank>(entity =>
        {
            entity.ToTable("QuestionnaireBank");

            entity.Property(e => e.QuestionnaireBankTitle).HasMaxLength(50);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("active");

            entity.HasOne(d => d.SuperAdmin).WithMany(p => p.QuestionnaireBanks)
                .HasForeignKey(d => d.SuperAdminId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuestionnaireBank_SuperAdmins");
        });

        modelBuilder.Entity<QuestionnaireQuestion>(entity =>
        {
            entity.ToTable("QuestionnaireQuestion");

            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("active");

            entity.HasOne(d => d.CustomerAdmin).WithMany(p => p.QuestionnaireQuestions)
                .HasForeignKey(d => d.CustomerAdminId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuestionnaireQuestion_CustomerAdmins");

            entity.HasOne(d => d.Question).WithMany(p => p.QuestionnaireQuestions)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuestionnaireQuestion_Question");

            entity.HasOne(d => d.Questionnaire).WithMany(p => p.QuestionnaireQuestions)
                .HasForeignKey(d => d.QuestionnaireId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuestionnaireQuestion_Questionnaire");
        });

        modelBuilder.Entity<QuestionnaireQuestionBank>(entity =>
        {
            entity.ToTable("QuestionnaireQuestionBank");

            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("active");

            entity.HasOne(d => d.QuestionBank).WithMany(p => p.QuestionnaireQuestionBanks)
                .HasForeignKey(d => d.QuestionBankId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuestionnaireQuestionBank_QuestionBank");

            entity.HasOne(d => d.QuestionnaireBank).WithMany(p => p.QuestionnaireQuestionBanks)
                .HasForeignKey(d => d.QuestionnaireBankId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuestionnaireQuestionBank_QuestionnaireBank");

            entity.HasOne(d => d.SuperAdmin).WithMany(p => p.QuestionnaireQuestionBanks)
                .HasForeignKey(d => d.SuperAdminId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuestionnaireQuestionBank_SuperAdmins");
        });

        modelBuilder.Entity<RegisteredEndUser>(entity =>
        {
            entity.HasKey(e => e.EndUserId);

            entity.Property(e => e.ContactNo).HasMaxLength(20);
            entity.Property(e => e.EmailId).HasMaxLength(50);
            entity.Property(e => e.Firstname).HasMaxLength(50);
            entity.Property(e => e.Lastname).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(50);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("active");
        });

        modelBuilder.Entity<SubscriptionCategory>(entity =>
        {
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("active");
            entity.Property(e => e.SubscriptionCategoryName).HasMaxLength(50);
        });

        modelBuilder.Entity<SuperAdmin>(entity =>
        {
            entity.Property(e => e.EmailId).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
